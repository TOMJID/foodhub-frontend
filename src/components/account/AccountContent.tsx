"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Store } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "react-hot-toast";

//? Components
import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { ProfileTab } from "@/components/account/ProfileTab";
import { StoreInfoTab } from "@/components/account/StoreInfoTab";
import { OrdersTab } from "@/components/account/OrdersTab";

//? Dialogs
import { EditUserDialog } from "@/components/account/dialogs/EditUserDialog";
import { EditStoreDialog } from "@/components/account/dialogs/EditStoreDialog";
import { ReviewDialog } from "@/components/account/dialogs/ReviewDialog";
import { ReviewItemDialog } from "@/components/account/dialogs/ReviewItemDialog";
import { CancelOrderDialog } from "@/components/account/dialogs/CancelOrderDialog";

//? Types
import {
  UserWithExtras,
  Order,
  ProviderProfile,
} from "@/components/account/types";

export function AccountContent() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [providerProfile, setProviderProfile] =
    useState<ProviderProfile | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  // Auto-creation states
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
  const [isAutoCreating, setIsAutoCreating] = useState(false);

  // Edit Profile States (Provider)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    restaurantName: "",
    cuisineType: "",
    address: "",
    coverImageUrl: "",
  });

  // Edit User Profile States (Global)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    image: "",
    address: "",
  });

  // Review states
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [reviewingMeal, setReviewingMeal] = useState<{
    mealId: string;
    mealName: string;
  } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Orders sub-tab state (for providers)
  const [ordersType, setOrdersType] = useState<"placed" | "received">("placed");

  // Cancel order state
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    setIsCancellingOrder(true);
    try {
      const response = await fetch(`/api/orders/cancel/${orderToCancel}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Order cancelled successfully");
        setOrders(
          orders.map((o) =>
            o.id === orderToCancel ? { ...o, status: "cancelled" } : o,
          ),
        );
        setOrderToCancel(null);
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancellingOrder(false);
    }
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/my", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  useEffect(() => {
    const fetchProviderProfile = async () => {
      setIsProviderLoading(true);
      try {
        const response = await fetch("/api/providers/me", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.success) {
          setProviderProfile(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch provider profile:", error);
      } finally {
        setIsProviderLoading(false);
        setHasCheckedProfile(true);
      }
    };

    if (session && (session.user as UserWithExtras).role === "provider") {
      fetchProviderProfile();
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Auto-create profile for providers if missing
  useEffect(() => {
    if (
      session &&
      (session.user as UserWithExtras).role === "provider" &&
      hasCheckedProfile &&
      !providerProfile &&
      !isAutoCreating
    ) {
      const autoCreate = async () => {
        setIsAutoCreating(true);
        const toastId = toast.loading("Initializing your kitchen...");

        try {
          const response = await fetch("/api/providers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurantName: session.user.name || "My Restaurant",
              cuisineType: "General",
              address: "Update Address",
              coverImageUrl: "",
            }),
          });

          const data = await response.json();

          if (data.success) {
            toast.success("Kitchen Profile Ready!", { id: toastId });
            setProviderProfile(data.data);
            setActiveTab("provider");
            // Refresh to ensure everything is synced
            router.refresh();
          } else {
            toast.dismiss(toastId);
          }
        } catch (error) {
          console.error("Auto-creation failed", error);
          toast.dismiss(toastId);
        } finally {
          setIsAutoCreating(false);
        }
      };

      autoCreate();
    }
  }, [session, hasCheckedProfile, providerProfile, isAutoCreating, router]);

  const user = session?.user as UserWithExtras;

  // Filtered orders
  const placedOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.customerId === user?.id ||
          o.customer?.email === user?.email ||
          (user?.role !== "provider"
            ? true
            : o.providerId !== providerProfile?.id),
      ),
    [orders, user, providerProfile],
  );

  const receivedOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.providerId === providerProfile?.id ||
          o.provider?.restaurantName === providerProfile?.restaurantName,
      ),
    [orders, providerProfile],
  );

  const openEditDialog = () => {
    if (providerProfile) {
      setEditForm({
        restaurantName: providerProfile.restaurantName,
        cuisineType: providerProfile.cuisineType,
        address: providerProfile.address,
        coverImageUrl: providerProfile.coverImageUrl || "",
      });
      setIsEditProfileOpen(true);
    }
  };

  const openEditUserDialog = () => {
    setUserForm({
      name: user.name || "",
      image: user.image || "",
      address: user.address || "",
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    setIsUpdatingUser(true);
    try {
      const { error } = await authClient.updateUser({
        name: userForm.name,
        image: userForm.image,
        // @ts-expect-error - address is a custom field
        address: userForm.address,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
      } else {
        toast.success("Profile updated successfully!");
        setIsEditUserOpen(false);
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await fetch("/api/providers/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        setProviderProfile({
          ...providerProfile!,
          ...editForm,
        });
        setIsEditProfileOpen(false);
      } else {
        toast.error(data.error || "Failed to update profile.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const submitReview = async () => {
    if (!reviewingMeal) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId: reviewingMeal.mealId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted! Thank you 🔥");
        setReviewingMeal(null);
        setRating(5);
        setComment("");
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isPending) {
    return (
      <div className='min-h-screen bg-cream'>
        <LoadingSpinner
          text='Loading Account...'
          size='xl'
          className='h-screen'
        />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white'>
      <AccountHeader />

      <main className='max-w-7xl mx-auto px-6 pt-32 pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
          <AccountSidebar user={user} />

          <div className='lg:col-span-3'>
            <h1 className='text-5xl font-serif font-black text-charcoal tracking-tighter mb-8 italic'>
              Dashboard
            </h1>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'>
              <TabsList className='bg-charcoal p-1 rounded-none h-auto flex flex-wrap lg:flex-nowrap gap-1'>
                <TabsTrigger
                  value='profile'
                  className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                  <User className='size-4 mr-2' />
                  Profile
                </TabsTrigger>
                {user.role === "provider" && (
                  <TabsTrigger
                    value='provider'
                    className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                    <Store className='size-4 mr-2' />
                    Store Info
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value='orders'
                  className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                  <Package className='size-4 mr-2' />
                  Orders
                </TabsTrigger>
              </TabsList>

              <div className='mt-8'>
                <TabsContent value='profile' className='space-y-8'>
                  <ProfileTab
                    user={user}
                    providerProfile={providerProfile}
                    isProviderLoading={isProviderLoading}
                    onEditProfile={openEditUserDialog}
                  />
                </TabsContent>

                {user.role === "provider" && (
                  <TabsContent value='provider' className='space-y-8'>
                    <StoreInfoTab
                      providerProfile={providerProfile}
                      isProviderLoading={isProviderLoading}
                      onEditStore={openEditDialog}
                    />
                  </TabsContent>
                )}

                <TabsContent value='orders'>
                  <OrdersTab
                    user={user}
                    orders={orders}
                    isOrdersLoading={isOrdersLoading}
                    ordersType={ordersType}
                    setOrdersType={setOrdersType}
                    onReviewOrder={setReviewingOrder}
                    onReviewMeal={(id, name) => {
                      setRating(5);
                      setComment("");
                      setReviewingMeal({ mealId: id, mealName: name });
                    }}
                    onCancelOrder={setOrderToCancel}
                    providerProfile={providerProfile}
                    placedOrders={placedOrders}
                    receivedOrders={receivedOrders}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <EditUserDialog
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        onUpdate={handleUpdateUser}
        isUpdating={isUpdatingUser}
        userForm={userForm}
        setUserForm={setUserForm}
      />

      <EditStoreDialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onUpdate={handleUpdateProfile}
        isUpdating={isUpdatingProfile}
        editForm={editForm}
        setEditForm={setEditForm}
      />

      <ReviewItemDialog
        order={reviewingOrder}
        onClose={() => setReviewingOrder(null)}
        onSelectMeal={(id, name) => {
          setReviewingOrder(null);
          setRating(5);
          setComment("");
          setReviewingMeal({ mealId: id, mealName: name });
        }}
      />

      <ReviewDialog
        isOpen={!!reviewingMeal}
        onClose={() => setReviewingMeal(null)}
        onUpdate={submitReview}
        isUpdating={isSubmittingReview}
        reviewingMeal={reviewingMeal}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
      />

      <CancelOrderDialog
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={confirmCancelOrder}
        isCancelling={isCancellingOrder}
      />
    </div>
  );
}

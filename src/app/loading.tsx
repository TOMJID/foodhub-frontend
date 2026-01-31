import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className='flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-cream/50'>
      <div className='flex flex-col items-center gap-2'>
        <LoadingSpinner size='xl' text='PREPARING ASSETS...' />
      </div>
    </div>
  );
}

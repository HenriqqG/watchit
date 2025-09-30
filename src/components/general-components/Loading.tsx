export default function Loading() {
    return (
        <>
            <div className="flex justify-center items-center py-6">
              <div className='h-3 w-3 mr-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-3 w-3 mr-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-3 w-3 bg-gray-300 rounded-full animate-bounce'></div>
            </div>
        </>
    )
}
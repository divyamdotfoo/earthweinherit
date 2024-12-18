export default function Loading() {
  return (
    <div className=" p-4 w-full">
      <div className=" w-72 rounded-md h-6 bg-muted animate-pulse"></div>
      <div className=" max-w-3xl w-full mx-auto py-8 flex flex-col gap-6">
        <div className=" w-3/5 h-12 rounded-full bg-muted animate-pulse"></div>
        <div className=" py-10 flex flex-wrap w-full items-stretch gap-3">
          <div className=" w-40 h-24 bg-muted rounded-lg animate-pulse"></div>
          <div className=" w-40 h-24 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className=" w-full h-80 animate-pulse bg-secondary mt-5"></div>
      </div>
    </div>
  );
}

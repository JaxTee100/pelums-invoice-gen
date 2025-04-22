import Link from "next/link";


export default function Home() {
  return (
    <div className="flex items-center flex-col justify-center min-h-screen p-24 bg-slate-900">
      <h1 className="text-6xl text-center text-white font-bold mb-20 text-shadow-amber-200 tracking-widest">Welcome to Elite Kitchen</h1>
      <Link href={'/invoice/new'}>
        <button className="flex items-center justify-center rounded-md p-4 shadow-md bg-pink-700 hover:bg-pink-500 cursor-pointer text-white font-semibold">Generate Invoice</button>
      </Link>

    </div>
  );
}

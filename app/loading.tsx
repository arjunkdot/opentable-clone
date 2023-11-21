import React from "react";
import Header from "./components/Header";

function Loading() {
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12].map((num) => (
          <div
            key={num}
            className="animate-pulse bg-slate-200 w-64 h-72 rounded overflow-hidden border cursor-pointer m-2"></div>
        ))}
      </div>
    </main>
  );
}

export default Loading;

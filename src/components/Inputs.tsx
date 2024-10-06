import React from "react";
import { useFormContext } from "react-hook-form"
function Inputs({title,name}:any) {
    const { register } = useFormContext()
    
    return (
    <div className="mb-4">
      <label className="text-zinc-900 block mb-2">{title}:</label>
      <input {...register(name)} type="text" className="border text-zinc-900 border-gray-300 rounded p-2 w-full"/>
    </div>
  );
}

export default Inputs;



// props{ title, body}

// type="text" className="border text-zinc-900 border-gray-300 rounded p-2 w-full"
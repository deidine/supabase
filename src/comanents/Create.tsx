import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import supabase from "../config/supabaseClient";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface FormData {
  id: number;
  name: string;
  last_name: string;
}

const Create = ({ isOpen, onClose }: ModalProps) => {
  const { register, handleSubmit,reset } = useForm<FormData>({ mode: "all" });
  const [error, setError] = useState<string>("");
  if (!isOpen) return null;

  const submit: SubmitHandler<FormData> = async (data2) => {
    try {
      const { data, error } = await supabase
        .from("deidine")
        .insert({ name: data2.name, last_name: data2.last_name });
        reset(); 
      if (error) {
        setError("Could not update the data");
      } else {
        onClose();
      }
    } catch (error) {
      setError("An error occurred while updating data");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Insert New Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              {...register("last_name", { required: true })}
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;

// [Window Title]
// Visual Studio Code
// [Content]
// Update imports for 'Create.tsx'?
// [Yes] [Always] [Never] [No]

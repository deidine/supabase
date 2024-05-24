import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "../config/supabaseClient";

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
   initialData: { id: number; name: string; last_name: string } | null;
}

interface FormData {
  id: number;
  name: string;
  last_name: string;
}

const Update  = ({ initialData, isOpen, onClose }:  UpdateModalProps) => {
  const { register, handleSubmit, setValue } = useForm<FormData>({ mode: "all" });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setValue("id", initialData.id);
      setValue("name", initialData.name);
      setValue("last_name", initialData.last_name);
    }
  }, [initialData, setValue]);

  const fetchTable = async () => {
    try {
      const { data, error } = await supabase
        .from("deidine")
        .select()
        .eq('id', initialData!.id)
        .single();

      if (error) {
        setError("Could not fetch the recipe");
      } else {
        setValue("name", data.name);
        setValue("last_name", data.last_name);
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    }
  };

  useEffect(() => {
    if (initialData?.id) {
      fetchTable();
    }
  }, [initialData?.id]);

  const submit: SubmitHandler<FormData> = async (data) => {
    try {
      const { error } = await supabase
        .from("deidine")
        .update({ name: data.name, last_name: data.last_name })
        .eq('id', data.id);

      if (error) {
        setError("Could not update the data");
      } else { 
        onClose();
      }
    } catch (error) {
      setError("An error occurred while updating data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Data</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)}>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="hidden"
            {...register("id")}
          />
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              {...register("last_name", { required: true })}
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;

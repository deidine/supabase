import React, { useEffect, useState } from "react";
import "./App.css";
import supabase from "./config/supabaseClient";
import Update from "./comanents/Update";
import Create from "./comanents/Create";
 

interface DataItem {
  id: number;
  name: string;
  last_name: string;
}

function App() {
  const [allData, setAllData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState<DataItem | null>(null);

  const fetchTable = async () => {
    try {
      const { data, error } = await supabase.from("deidine").select();

      if (error) {
        setError("Could not fetch the recipes");
        setAllData([]);
      } else {
        setAllData(data || []);
        setError("");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      setAllData([]);
    }
  };

  useEffect(() => {
    fetchTable();
  }, []);

  const handleInsert = async (newData: { name: string; last_name: string }) => {
    const { data, error } = await supabase.from("deidine").insert(newData);

    if (!error) {
      fetchTable();  
    }
  };

  const handleUpdate = async (updatedData: { id: number; name: string; last_name: string }) => {
    const { data, error } = await supabase
      .from("deidine")
      .update({ name: updatedData.name, last_name: updatedData.last_name })
      .eq("id", updatedData.id);

    if (!error) {
      fetchTable(); 
    }
  };

  const handleDelete = async (id: number) => {
    setAllData(allData.filter((items: DataItem) => items.id !== id));
    const { data, error } = await supabase.from("deidine").delete().eq("id", id);
    if (!error) {
      fetchTable();  
    }
  };

  const openUpdateModal = (item: DataItem) => {
    setCurrentData(item);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
    <div className="flex flex-col p-4 bg-gray-100 text-gray-900 tracking-wider leading-normal">
      <button
        className="rounded-xl bg-green-600 text-white w-40 p-1 ml-4 font-bold border-2"
        onClick={() => setIsModalOpen(true)}
      >
        Insert New
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <div id="recipients" className="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
        <table className="stripe hover w-full pt-4 pb-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allData.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.last_name}</td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-700 text-white p-2 rounded-lg font-bold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openUpdateModal(item)}
                    className="bg-yellow-400 text-white p-2 rounded-lg font-bold"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      < Create 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInsert}
      />
      <Update 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={currentData}
      />
      </div>
      </>
 
  );
}

export default App;

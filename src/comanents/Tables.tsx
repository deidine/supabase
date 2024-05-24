import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from 'react-router-dom';
import Create from "./Create";
import Update from "./Update";

interface DataItem {
  id: number;
  name: string;
  last_name: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  preferred_username: string;
}

function Table() {
  const [allData, setAllData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState<DataItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTable = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("deidine").select().order('id', { ascending: true });
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
    } finally {
      setIsLoading(false);
    }
  };

  const searchDtat = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("deidine")
        .select()
        .ilike("name", "%" + search + "%");

      setAllData(data || []);
      setSearch("")
    } catch (error) {
      setError("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const { id, email, user_metadata } = data.user;
      setUser({
        id,
        email: email || "",
        full_name: user_metadata.full_name || "",
        avatar_url: user_metadata.avatar_url || "",
        preferred_username: user_metadata.preferred_username || "",
      });
    }
  };

  useEffect(() => {
    fetchTable();
    fetchUser();
  }, []);

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase
      .from("deidine")
      .delete()
      .eq("id", id);
    if (!error) {
      fetchTable();
    }
  };

  const navigate = useNavigate();
  
  const openUpdateModal = (item: DataItem) => {
    setCurrentData(item);
    setIsUpdateModalOpen(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col p-6 bg-gray-100 text-gray-900 tracking-wider leading-normal min-h-screen">
        <div className="flex flex-row items-center p-2 space-x-4">
        <button
            className="rounded-xl bg-green-600 text-white px-4 py-2 font-bold shadow-md hover:bg-green-700 transition duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Insert New
          </button> 
          <button
            className="rounded-xl bg-yellow-600 text-white px-4 py-2 font-bold shadow-md hover:bg-green-700 transition duration-300"
            onClick={() => 
              navigate("/login")
             }
          >
          Login
          </button>
          {user && (
            <div className="flex items-center space-x-2">
              <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
              <h1>Welcome, {user.full_name} ({user.preferred_username})</h1>
            </div>
          )}
          <button
            className="rounded-xl bg-red-600 text-white px-4 py-2 font-bold shadow-md hover:bg-red-700 transition duration-300"
            onClick={signOut}
          >
            Sign Out
          </button>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="Search by name"
          />
          <button
            onClick={searchDtat}
            className="rounded-xl bg-blue-600 text-white px-4 py-2 font-bold shadow-md hover:bg-blue-700 transition duration-300"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {isLoading ? (
          <p className="mt-4">Loading...</p>
        ) : (
          <div
            id="recipients"
            className="p-8 mt-6 rounded shadow bg-white overflow-x-auto"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openUpdateModal(item)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-600 transition duration-300"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Create
          isOpen={isModalOpen}
          onClose={() => {
            fetchTable();
            setIsModalOpen(false);
          }}
        />
        <Update
          isOpen={isUpdateModalOpen}
          onClose={() => {
            fetchTable();
            setIsUpdateModalOpen(false);
          }}
          initialData={currentData}
        />
      </div>
    </>
  );
}

export default Table;

import React, { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import supabase from '../config/supabaseClient';

function ImageUpload() {
  const [image, setImage] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const user = useUser();
   
  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);
  const CDNURL =
  "https://ujdcmqlvcyftynjoyfor.supabase.co/storage/v1/object/public/images/";
  
  const handleImageChange = async (event:any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));

      const filePath = `${file.name}`;

      setUploading(true);
      const { data, error } = await supabase.storage
      .from("avtars")
      .upload(`/companies/${filePath}`, file);

      setUploading(false);
      console.error(error);
      if (data) {
        getImages();
      } else {
        console.error(error);
      }
    }
  }

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("avtars")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data) {
      setImage(data);
    } else {
      console.error("Error loading images", error);
    }
  }

  return (
    <div>
      {user?.email}dwde
      <input type='file' onChange={handleImageChange} disabled={uploading} />
      {image && <img src={image} alt='Preview' />}
      <button onClick={handleImageChange} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      <RenderImage path={"edit.png"}/>
    </div>
  );
}

export default ImageUpload;

const RenderImage = ({ path }:{path:any}) => {
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = supabase.storage
        .from("avtars")
        .getPublicUrl(path);

      if (data) {
        setPublicUrl(data.publicUrl);
      }
    })();
  }, [path]);

  return <>{publicUrl}<img src={publicUrl} alt="Uploaded" /></> ;
};
import Inputs from "@/components/Inputs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useModal from "../../hooks/usePopUp";
import useSelectedPost from "../../hooks/useSelectedPost";

export default function Home() {
  interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

  const { isModalOpen, openModal, closeModal } = useModal();
  
  const { selectedPost, selectPost } = useSelectedPost<Post>();


  const methods = useForm<{
    title: string;
    body: string;
  }>();

  async function getData(): Promise<Post[]> {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  }

  const { data } = useQuery({
    queryKey: ["login"],
    queryFn: getData,
  });
 

  const handleEditClick = (post: Post) => {
    selectPost(post);
    methods.reset({
      title: post.title.split(" ").slice(0, 2).join(" "), // First two words of the title
      body: post.body.split(" ").slice(0, 2).join(" "), // First two words of the body
    });
    openModal();
  };

  const onSubmit = (formData: { title: string; body: string }) => {
    if (selectedPost) {
      // Create an updated post object
      const updatedPost = {
        ...selectedPost,
        title: formData.title,
        body: formData.body,
      };
     
    }
  };
  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="pt-10 bg-slate-600 flex flex-col justify-around items-center h-screen">
      <div className="w-[80%] h-[60%] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="text-gray-800 bg-amber-400 w-full h-8 flex items-center justify-around">
          <p className="w-[15%] border border-white text-center">User ID</p>
          <p className="w-[10%] border border-white text-center">ID</p>
          <p className="w-[20%] border border-white text-center">Title</p>
          <p className="w-[20%] border border-white text-center">Body</p>
        </div>

        <div className="bg-slate-600 h-full overflow-y-auto">
          {data?.slice(0, 3).map(({ id, title, body, userId }: Post, index) => (
            <div
              className="flex justify-around w-full py-2 border-b border-gray-200 hover:bg-zinc-900"
              key={id}
            >
              <p className="w-[15%] border border-white text-center">
                {userId}
              </p>
              <p className="w-[10%] border border-white text-center">{id}</p>
              <h3 className="w-[20%] border border-white text-center">
                {title.split(" ").slice(0, 2).join(" ")}
              </h3>
              <p className="w-[20%] border border-white text-center">
                {body.split(" ").slice(0, 2).join(" ")}
              </p>
              <button
                onClick={() => handleEditClick(data[index])}
                className="w-[10%] border border-white text-white bg-blue-500 hover:bg-blue-600 transition duration-200 ease-in-out rounded"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <FormProvider {...methods}>
          
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white rounded-lg p-4 w-1/3">
            <h2 className="text-lg font-bold mb-4 text-zinc-900">Edit Post</h2>
            <form onSubmit={methods.handleSubmit(onSubmit)}>


              <Inputs name="title" title="Title:"/>
              <Inputs name="body" title="body:"/>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200 ease-in-out"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-200 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

        </div>
         </FormProvider>

      )}
    </div>
    
  );
}

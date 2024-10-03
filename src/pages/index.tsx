import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export default function Home() {
  interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { register, handleSubmit, reset } = useForm<{
    title: string;
    body: string;
  }>();

  async function getData(): Promise<Post[]> {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  }

  const { data, refetch } = useQuery({
    queryKey: ["login"],
    queryFn: getData,
  });
 async function putData(updatedPost: Post){
  let putResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${1}`, updatedPost); 
  return putResponse.data
  }

const {mutate} = useMutation({
  mutationFn: putData,
  mutationKey: ["post", "add"],
  onSuccess: () => {
    refetch(); // Refetch the data after the mutation succeeds
    setIsModalOpen(false); // Close the modal
  },
 
});

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    reset({
      title: post.title.split(" ").slice(0, 2).join(" "), // First two words of the title
      body: post.body.split(" ").slice(0, 2).join(" "), // First two words of the body
    });
    setIsModalOpen(true);
  };

  const onSubmit = (formData: { title: string; body: string }) => {
    if (selectedPost) {
      // Create an updated post object
      const updatedPost = {
        ...selectedPost,
        title: formData.title,
        body: formData.body,
      };
      mutate(updatedPost); // Trigger the mutation
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 w-1/3">
            <h2 className="text-lg font-bold mb-4 text-zinc-900">Edit Post</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="text-zinc-900 block mb-2">Title:</label>
                <input
                  {...register("title", { required: true })}
                  type="text"
                  className="border text-zinc-900 border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="text-zinc-900 block mb-2 ">Body:</label>
                <input
                  {...register("body", { required: true })}
                  type="text"
                  className="border text-zinc-900 border-gray-300 rounded p-2 w-full"
                />
              </div>

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
      )}
    </div>
  );
}

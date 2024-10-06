import { useState } from "react";

function useSelectedPost<Post>() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const selectPost = (post: Post) => setSelectedPost(post);
  const clearSelectedPost = () => setSelectedPost(null);

  return { selectedPost, selectPost, clearSelectedPost };
}

export default useSelectedPost;

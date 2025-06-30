import { Comment } from "../../presentation/components";
import usePosts from "../hooks/usePosts";

const Posts = () => {
  const postsProps = usePosts();
  return (
    <div>
      <Comment {...postsProps} />
    </div>
  );
};

export default Posts;

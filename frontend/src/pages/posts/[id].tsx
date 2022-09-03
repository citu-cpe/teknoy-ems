import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextPage } from 'next';

const PostPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <>
      <h1>Post: {id}</h1>
      <ul>
        <li>
          <Link href={`/post/${id}/first-comment`}>
            <a>First comment</a>
          </Link>
        </li>
        <li>
          <Link href={`/post/${id}/second-comment`}>
            <a>Second comment</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default PostPage;

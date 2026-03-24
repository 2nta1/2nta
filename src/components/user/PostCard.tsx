"use client";
import Image from "next/image";

export interface Post {
  id: string;
  content?: string | null;
  image?: string | null;
  createdAt: string;
  user?: {
    name: string;
    image?: string | null;
  } | null;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3 mb-2">
        {post.user?.image ? (
          <Image src={post.user.image} alt="avatar" width={40} height={40} className="rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
            {post.user ? post.user.name.charAt(0) : "?"}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800">{post.user?.name ?? "مستخدم"}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {post.content && <p className="text-gray-800 mb-2 whitespace-pre-wrap">{post.content}</p>}
      {post.image && (
        <div className="mt-2">
          <Image src={post.image} alt="post image" width={400} height={300} className="rounded-md object-cover" />
        </div>
      )}
    </div>
  );
}

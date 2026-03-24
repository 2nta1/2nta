'use client'
import { useState } from "react";
import Image from "next/image";
import { FiBriefcase, FiMoreHorizontal, FiThumbsUp, FiMessageSquare, FiShare2, FiMapPin, FiCalendar } from "react-icons/fi";
import Link from "next/link";

export interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  image?: string | null;
  createdAt: string;
  company: {
    id?: string;
    name: string;
    logoUrl?: string | null;
    image?: string | null;
  };
}

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export default function PostCard({ post, onDelete, isOwner }: PostCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={post.company.id ? `/dashboard/companies/${post.company.id}` : '#'}
            className="flex-shrink-0"
          >
            {post.company.logoUrl || post.company.image ? (
              <Image
                src={post.company.logoUrl ?? post.company.image!}
                alt="logo"
                width={44}
                height={44}
                className="rounded-full object-cover ring-2 ring-slate-50 border border-slate-200"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-black border border-blue-200">
                {post.company.name.charAt(0)}
              </div>
            )}
          </Link>
          <div>
            <Link
              href={post.company.id ? `/dashboard/companies/${post.company.id}` : '#'}
              className="font-black text-slate-900 hover:text-primary transition-colors block text-sm leading-tight"
            >
              {post.company.name}
            </Link>
            <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
              <FiCalendar className="text-[10px]" />
              <span className="text-[11px]">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {isOwner ? (
          <button
            onClick={() => onDelete?.(post.id)}
            className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
          >
            <FiMoreHorizontal />
          </button>
        ) : (
          <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            Partner
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3 flex-1">
        {post.type === 'JOB' && (
          <div className="mb-3 flex items-center gap-2 text-primary font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
            <FiBriefcase />
            فرصة عمل جديدة
          </div>
        )}
        <h3 className="font-bold text-slate-900 mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">
          {post.content}
        </p>
      </div>

      {/* Image if exists */}
      {post.image && (
        <div className="relative aspect-[16/9] w-full bg-slate-100 border-y border-slate-100">
          <Image
            src={post.image}
            alt="post visual"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-slate-50">
        <div className="flex items-center justify-between py-1 text-slate-400 border-b border-slate-50 mb-1">
          <div className="flex items-center gap-1 text-[11px]">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">
              <FiThumbsUp />
            </div>
            <span>{liked ? 1 : 0} تفاعل</span>
          </div>
          <span className="text-[11px]">0 تعليقات</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLiked(!liked)}
            className={`social-button ${liked ? '!text-primary bg-blue-50/50' : ''}`}
          >
            <FiThumbsUp className={liked ? 'fill-primary' : ''} />
            <span className="text-xs">أعجبني</span>
          </button>
          <button className="social-button">
            <FiMessageSquare />
            <span className="text-xs">تعليق</span>
          </button>
          <button className="social-button">
            <FiShare2 />
            <span className="text-xs">مشاركة</span>
          </button>
        </div>
      </div>
    </div>
  );
}

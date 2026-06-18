"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:4000/posts/5")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPost(data);
      });
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1>{post.title}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: post.contents,
        }}
      />
    </div>
  );
}
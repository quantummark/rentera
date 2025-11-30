import React, { type ReactElement } from 'react';
import PostPageClient from './PostPageClient';

interface PostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default function PostPage({ params }: PostPageProps): ReactElement {
  // ✅ правильный способ для нового Next: params — это Promise
  const { postId } = React.use(params);

  return <PostPageClient postId={postId} />;
}
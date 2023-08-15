import * as React from 'react';
import { createClient } from 'next-sanity';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { HeaderContainer } from '@/containers/Header/HeaderContainer';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import styles from './post.module.scss';
import { ImageContainer } from '@/containers/Image/ImageContainer';

interface PostData {
    id: string;
    title: string;
    subtitle: string;
    price?: string;
    publishedAt?: string;
    imageUrl: string;
    sold: boolean;
}

interface PageProps {
    post: PostData;
}

const Post: NextPage<PageProps> = ({ post }) => {
    const { push } = useRouter();

    const publishingYear = post.publishedAt && new Date(post.publishedAt).getFullYear();

    const handleClick = React.useCallback(() => {
        push(`/contact?title=${post.title}`);
    }, []);

    return (
        <>
            <HeaderContainer />
            <>
                <div className={styles.root}>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.description}>
                        {publishingYear && (
                            <p className="text-2xl flex gap-2">
                                <span>Year:</span>
                                <b>{publishingYear}</b>
                            </p>
                        )}
                        <p className="text-2xl">{post.subtitle}</p>
                    </div>

                    <div className="overflow-hidden rounded-md relative">
                        <ImageContainer alt={post.title} src={post.imageUrl} width={1152} height={1000} />
                        {post.sold && <div className={styles.label}>Sold</div>}
                        {post.price && !post.sold && <div className={styles.label}>{post.price}</div>}
                    </div>
                </div>
                {!post.sold && (
                    <div className={styles.buttonContainer}>
                        <button type="button" onClick={handleClick} className={styles.button}>
                            Enquire
                        </button>
                    </div>
                )}
            </>
            <FooterContainer />
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const postId = params?.postId;
    const post = await client.fetch(`*[_type == 'post' && _id == '${postId}']{
          title,
          subtitle,
          publishedAt,
          sold,
          price,
          "id": _id,
          "imageUrl": mainImage.asset->url
      }[0]`);

    return {
        props: {
            post,
        },
    };
};

export default Post;

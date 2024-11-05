// pages/[shortCode].tsx
import { GetServerSideProps, NextPage } from 'next';
import { getUrl } from '@/lib/mongodb';

type Props = {};

const RedirectPage: NextPage<Props> = () => {
    return null; // No content is needed since we’re redirecting
};

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
    const shortCode = params?.shortCode as string;

    if (!shortCode) {
        return { notFound: true };
    }

    try {
        console.log('Fetching original URL for short code:', shortCode);
        const originalUrl = await getUrl(shortCode);

        if (!originalUrl) {
            console.error('No URL found for short code:', shortCode);
            return { notFound: true };
        }

        // Redirect to the original URL
        res.writeHead(302, { Location: originalUrl });
        res.end();
        return { props: {} };
    } catch (error) {
        console.error('Error occurred:', error);
        return { notFound: true };
    }
};

export default RedirectPage;

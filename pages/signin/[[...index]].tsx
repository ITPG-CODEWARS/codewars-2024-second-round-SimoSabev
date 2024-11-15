import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <SignIn path="/signin" routing="path" />
        </main>
    );
}

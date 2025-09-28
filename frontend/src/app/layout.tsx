import "./globals.css";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-50">
                <UserProvider>{children}</UserProvider>
            </body>
        </html>
    );
}

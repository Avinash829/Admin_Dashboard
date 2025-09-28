"use client";
import Protected from "@/components/Protected";
import DashboardStats from "@/components/DashboardStats";

export default function DashboardPage() {
    return (
        <Protected>
            <DashboardStats />
        </Protected>
    );
}
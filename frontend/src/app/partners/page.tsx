"use client";
import Protected from "@/components/Protected";
import PartnersTable from "@/components/PartnersTable";

export default function PartnersPage() {
    return (
        <Protected>
            <PartnersTable />
        </Protected>
    );
}
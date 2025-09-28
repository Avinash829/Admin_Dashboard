"use client";
import CasesTable from "@/components/CasesTable";
import Protected from "@/components/Protected";

export default function CasesPage() {
    return (
        <Protected>
            <CasesTable />
        </Protected>
    );
}
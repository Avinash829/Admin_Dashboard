"use client";
import Protected from "@/components/Protected";
import TeamsTable from "@/components/TeamsTable";

export default function TeamsPage() {
    return (
        <Protected>
            <TeamsTable />
        </Protected>
    );
}

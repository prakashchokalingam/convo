"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/shared/ui/button'; // Assuming Button component path
// If you have a pre-styled Table, THead, TBody, Tr, Th, Td, import them. Otherwise, use standard HTML tags.

const ITEMS_PER_PAGE = 10;

interface FormResponse {
  id: string;
  formId: string;
  data: any; // JSON string initially, might be parsed
  metadata?: any | null;
  completedAt: string; // ISO string
}

interface FormDetails {
  id: string;
  title: string;
  // Add other fields if needed from the API's form object
}

interface PaginationData {
  page: number;
  limit: number;
  totalResponses: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function FormResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;
  const workspaceSlug = params.workspaceSlug as string;

  const [responsesList, setResponsesList] = useState<FormResponse[]>([]);
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId) return;

    const fetchResponses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/forms/${formId}/responses?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch responses');
        }
        const data = await response.json();
        setResponsesList(data.responses || []);
        setFormDetails(data.form || null);
        setPaginationData(data.pagination || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setResponsesList([]);
        setFormDetails(null);
        setPaginationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId, currentPage]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading responses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: {error}</p>
        <Link href={`/${workspaceSlug}/forms`} className="mt-4 inline-block">
          <Button variant="outline">&larr; Back to Forms</Button>
        </Link>
      </div>
    );
  }

  if (!formDetails) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Form details not found.</p>
         <Link href={`/${workspaceSlug}/forms`} className="mt-4 inline-block">
          <Button variant="outline">&larr; Back to Forms</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-start items-center mb-4">
        <Link href={`/${workspaceSlug}/forms`}>
          <Button variant="outline" size="sm">&larr; Back to Forms</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Responses for: <span className="font-semibold">{formDetails.title}</span>
      </h1>

      {responsesList.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-500">No responses yet for this form.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metadata
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responsesList.map((response) => (
                  <tr key={response.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(response.completedAt), 'MMMM d, yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <pre className="whitespace-pre-wrap break-all bg-gray-50 p-2 rounded text-xs">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {response.metadata ? (
                        <pre className="whitespace-pre-wrap break-all bg-gray-50 p-2 rounded text-xs">
                          {JSON.stringify(response.metadata, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginationData && paginationData.totalResponses > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{paginationData.page}</span> of <span className="font-medium">{paginationData.totalPages}</span>
                  <span className="ml-2">({paginationData.totalResponses} responses)</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={!paginationData.hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!paginationData.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

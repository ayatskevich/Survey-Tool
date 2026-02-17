import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { exportAnalytics } from '../services/adminService';
import type { ExportAnalyticsDto } from '../types';

interface ExportDialogProps {
  surveyId: string;
  surveyTitle: string;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ surveyId, surveyTitle, onClose }) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const exportMutation = useMutation({
    mutationFn: async (dto: ExportAnalyticsDto) => {
      await exportAnalytics(dto);
    },
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to export data');
    },
  });

  const handleExport = () => {
    setErrorMessage('');
    
    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setErrorMessage('From date must be before to date');
      return;
    }

    const dto: ExportAnalyticsDto = {
      surveyId,
      format,
      includeAnswers,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    };

    exportMutation.mutate(dto);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Export Survey Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={exportMutation.isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Survey Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Survey:</p>
          <p className="font-medium">{surveyTitle}</p>
        </div>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as 'csv')}
                className="mr-2"
                disabled={exportMutation.isPending}
              />
              <span className="text-sm">CSV (Comma-Separated Values)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value as 'json')}
                className="mr-2"
                disabled={exportMutation.isPending}
              />
              <span className="text-sm">JSON (JavaScript Object Notation)</span>
            </label>
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range (Optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                disabled={exportMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                disabled={exportMutation.isPending}
              />
            </div>
          </div>
        </div>

        {/* Include Answers Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeAnswers}
              onChange={(e) => setIncludeAnswers(e.target.checked)}
              className="mr-2"
              disabled={exportMutation.isPending}
            />
            <span className="text-sm text-gray-700">Include detailed answers</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            If unchecked, only response metadata will be exported
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            disabled={exportMutation.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
          >
            {exportMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

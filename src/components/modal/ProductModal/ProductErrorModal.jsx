'use client';

import { AlertTriangle, X } from 'lucide-react';
import BaseModal from '../BaseModal';

const ProductErrorModal = ({ isOpen, onClose, title = "Action Failed", message, details }) => {
    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title=""
            zIndex="z-[99999]"
        >
            <div className="flex flex-col items-center text-center p-2">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                    <AlertTriangle className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 whitespace-pre-line leading-relaxed">
                    {message}
                </p>

                {details && details.length > 0 && (
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 text-left text-xs text-gray-700 max-h-36 overflow-y-auto">
                        <span className="font-semibold block text-gray-900 mb-1">Details:</span>
                        <ul className="list-disc pl-4 space-y-1">
                            {details.map((d, i) => (
                                <li key={i}>{d}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="w-full flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-lg transition shadow-xs cursor-pointer"
                    >
                        I Understand / Fix Now
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ProductErrorModal;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const AIPanel = () => {
    const [aiPrompt, setAiPrompt] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    function onChangePrompt(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setAiPrompt(value);
    }

    async function submitAIPrompt() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/prompt-gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: aiPrompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            setData(result.response);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="comments-container">
            <div>
                <input
                    type="text"
                    name='aiPrompt'
                    onChange={onChangePrompt}
                    value={aiPrompt}
                    placeholder="Enter AI Prompt"
                    className='px-2 py-4'
                />

                <Button
                    type="button"
                    className="gradient-blue flex gap-1 shadow-md"
                    onClick={submitAIPrompt}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send'}
                </Button>
            </div>

            <div>
                {error && <p className="text-red-500">{error}</p>}
                {data && <div className="ai-response">{data}</div>}
            </div>
        </div>
    );
};

export default AIPanel;
import { useState } from 'react';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TextContentProps {
  content: string;
  platform: 'x' | 'linkedin';
  icon: React.ReactNode;
}

export function TextContent({ content, platform, icon }: TextContentProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const getPlatformName = () => {
    return platform === 'x' ? 'X (Twitter)' : 'LinkedIn';
  };

  const getCharacterCount = () => {
    return content.length;
  };

  const getMaxCharacters = () => {
    return platform === 'x' ? 280 : 3000;
  };

  const isOverLimit = () => {
    return getCharacterCount() > getMaxCharacters();
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-lg font-semibold text-white">{getPlatformName()}</h4>
        </div>
        <Button
          size="sm"
          onClick={copyToClipboard}
          className={`transition-all ${
            copied
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-[#1E90FF] hover:bg-[#1E90FF]/90'
          } text-white`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] min-h-[120px]">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {getCharacterCount()} / {getMaxCharacters()} characters
          </span>
          {isOverLimit() && (
            <span className="text-red-500 font-semibold">
              Over limit by {getCharacterCount() - getMaxCharacters()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

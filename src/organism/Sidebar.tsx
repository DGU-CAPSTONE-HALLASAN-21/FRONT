import { useState } from 'react';
import { Upload, Folder, Plus, Pencil, Trash2, FileText, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface FolderItem {
  id: string;
  name: string;
}

export function Sidebar() { 
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([
    { id: '1', name: '2024 채용 데이터' },
  ]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>('1');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFiles = files.filter(file => file.name.endsWith('.csv'));
    
    if (csvFiles.length > 0) {
      const newFiles = csvFiles.map(f => f.name).filter(name => !uploadedFiles.includes(name));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${csvFiles.length}개 파일 업로드 완료!`, { duration: 3000 });
    } else {
      toast.error('CSV 파일만 업로드 가능합니다', { duration: 3000 });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const csvFiles = Array.from(files).filter(file => file.name.endsWith('.csv'));
      if (csvFiles.length > 0) {
        const newFiles = csvFiles.map(f => f.name).filter(name => !uploadedFiles.includes(name));
        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast.success(`${csvFiles.length}개 파일 업로드 완료!`, { duration: 3000 });
      } else {
        toast.error('CSV 파일만 업로드 가능합니다', { duration: 3000 });
      }
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileName));
    toast.info('파일이 제거되었습니다', { duration: 2000 });
  };

  const addFolder = () => {
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: `새 폴더 ${folders.length + 1}`,
    };
    setFolders([...folders, newFolder]);
    toast.success('새 폴더가 생성되었습니다', { duration: 2000 });
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter((f) => f.id !== id));
    if (selectedFolder === id) {
      setSelectedFolder(null);
    }
    toast.info('폴더가 삭제되었습니다', { duration: 2000 });
  };

  const updateFolderName = (id: string, name: string) => {
    setFolders(folders.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const selectFolder = (id: string) => {
    setSelectedFolder(id);
  };

  const startEdit = (id: string) => {
    setEditingFolder(id);
  };

  // 사이드바 닫혀있을 때
  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 72 }}
        animate={{ width: 56 }}
        className="h-full rounded-2xl p-3 flex flex-col items-center gap-4"
        style={{
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 16px -8px rgba(31, 38, 135, 0.1)',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg hover:bg-white/30 transition-colors"
          title="사이드바 펼치기"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </motion.button>

        <div className="h-px w-full bg-white/20" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-lg hover:bg-white/30 transition-colors"
          title="파일 업로드"
        >
          <Upload className="w-5 h-5 text-purple-500" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-lg hover:bg-white/30 transition-colors"
          title="폴더"
        >
          <Folder className="w-5 h-5 text-purple-500" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: 250 }}
      className="h-full rounded-2xl p-5 pb-6 flex flex-col gap-2"
      style={{
        background: 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 16px -8px rgba(31, 38, 135, 0.1)',
      }}
    >
      {/* 사이드바 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-700 text-sm">데이터 관리</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-white/30 transition-colors"
          title="사이드바 접기"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </motion.button>
      </div>

      <div className="h-px w-full bg-white/20" />

      {/* 파일 업로드 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-purple-500" />
          <h4 className="text-gray-700 text-xs">파일 업로드</h4>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            transition-all duration-300
            ${
              isDragging
                ? 'border-purple-400 scale-[1.02] bg-purple-50/30'
                : 'border-purple-200 hover:border-purple-300 hover:bg-white/10'
            }
          `}
          style={{
            background: isDragging 
              ? 'rgba(167, 139, 250, 0.15)' 
              : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <input
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload
              className={`w-6 h-6 mx-auto mb-1 transition-colors ${
                isDragging ? 'text-purple-500' : 'text-purple-400'
              }`}
            />
            <p className="text-gray-700 text-xs">CSV 드래그 또는 클릭</p>
            <p className="text-gray-500 text-xs mt-0.5">복수 선택 가능</p>
          </motion.div>
        </div>

        {/* Uploaded Files List */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5 max-h-[80px] overflow-y-auto custom-scrollbar"
            >
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={file}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/30 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(167, 139, 250, 0.2)',
                  }}
                >
                  <FileText className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="flex-1 text-xs text-gray-700 truncate">{file}</span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFile(file)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100/50 transition-opacity"
                    title="제거"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px w-full bg-white/20" />

      {/* Folders Section - Always visible */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-700 text-xs">폴더 선택</h4>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={addFolder}
            className="p-1 rounded-md hover:bg-white/30 transition-colors"
            title="새 폴더"
          >
            <Plus className="w-4 h-4 text-purple-500" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group"
              >
                <div
                  className={`
                    flex items-center gap-2 px-2.5 py-2 rounded-lg 
                    hover:bg-white/30 transition-all cursor-pointer
                    ${selectedFolder === folder.id ? 'bg-white/30 shadow-sm' : ''}
                  `}
                  onClick={() => selectFolder(folder.id)}
                  style={
                    selectedFolder === folder.id
                      ? {
                          background: 'rgba(167, 139, 250, 0.15)',
                          border: '1px solid rgba(167, 139, 250, 0.3)',
                        }
                      : {}
                  }
                >
                  <Folder
                    className={`w-4 h-4 flex-shrink-0 ${
                      selectedFolder === folder.id ? 'text-purple-500' : 'text-gray-500'
                    }`}
                  />
                  
                  {editingFolder === folder.id ? (
                    <input
                      type="text"
                      value={folder.name}
                      onChange={(e) => updateFolderName(folder.id, e.target.value)}
                      onBlur={() => setEditingFolder(null)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setEditingFolder(null);
                        }
                      }}
                      className="flex-1 bg-transparent border-b border-purple-300 outline-none text-gray-700 text-xs"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="flex-1 text-gray-700 text-xs truncate">{folder.name}</span>
                  )}

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(folder.id);
                      }}
                      className="p-1 rounded hover:bg-white/50"
                      title="이름 변경"
                    >
                      <Pencil className="w-3 h-3 text-blue-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="p-1 rounded hover:bg-red-100/50"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

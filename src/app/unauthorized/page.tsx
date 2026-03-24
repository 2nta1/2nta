export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-3xl font-bold">!</span>
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">غير مصرح بالوصول</h1>
        <p className="mb-6 text-gray-700">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}
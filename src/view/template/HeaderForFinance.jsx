export default function Header({ title, description }) {
  return (
    <div className='mb-8 text-center'>
      <h1 className='text-3xl font-bold text-gray-800'>{title}</h1>
      <p className='mt-2 text-sm text-gray-500'>{description}</p>
    </div>
  );
}

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test</h1>
      <p className="text-sm text-muted-foreground mb-6">If you can see these images, TMDB works fine:</p>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs mb-2">Regular img tag:</p>
          <img 
            src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" 
            alt="Interstellar"
            width={200}
            height={300}
          />
        </div>
        
        <div>
          <p className="text-xs mb-2">With style:</p>
          <img 
            src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUOzMKh6GGE.jpg" 
            alt="Dark Knight"
            style={{width: 200, height: 300, objectFit: 'cover'}}
          />
        </div>

        <div>
          <p className="text-xs mb-2">CSS class:</p>
          <img 
            src="https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg" 
            alt="Inception"
            className="w-[200px] h-[300px] object-cover rounded"
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">LocalStorage Check</h2>
      <TestLocalStorage />
    </div>
  );
}

function TestLocalStorage() {
  "use client";
  return (
    <div>
      <p className="text-sm text-muted-foreground">Open browser console (F12) and check for errors</p>
    </div>
  );
}

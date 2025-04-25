interface Window {
  google: {
    maps: {
      importLibrary: (library: string) => Promise<any>;
    };
  };
} 
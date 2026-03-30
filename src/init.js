    // Initialize all modules
    Object.values(Modules).forEach(module => {
        if (typeof module.init === 'function') {
            module.init();
        }
    });



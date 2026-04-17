const HospitalHelper = {
    cmds: 'hospital',
    settings: [
        { key: 'HospitalHelper_TrackHealing', label: 'Track Healing Times', defaultValue: true }
    ],
    init: function() {
        const settings = Utils.getSettings();
        
        if (settings['HospitalHelper_TrackHealing'] !== false) {
            this.trackHealing();
        }
    },
    trackHealing: function() {
        const healForms = document.querySelectorAll('form.healButton');
        healForms.forEach(form => {
            form.addEventListener('submit', () => {
                localStorage.setItem('hw_healing_last_used', Date.now().toString());
            });
        });
    },
};

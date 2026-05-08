const HospitalHelper = {
    cmds: 'hospital',
    staff: false,
    group: 'City',
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
                Utils.setItem('hw_healing_last_used', Date.now().toString());
            });
        });
    },
};

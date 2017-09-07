class Tab {
    /** @param {HTMLElement} $elm */
    constructor($elm) {
        this.$elm = $elm;
        this.$parent = $elm.parentNode;
        this.$active = Array.from($elm.children)
                        .filter($tab=>$tab.hasAttribute("tab-active"))[0];

        $elm.addEventListener("click", (e)=>{
            if (e.target.parentNode === this.$elm) {
                if (e.target === this.$active) { return; }
                this.setActiveTab(e.target);
            }
        });
        this.setActiveTab(this.$active);

        let $targets = Array.from($elm.children)
                            .map($tab=>this.getTarget($tab));
        let _minHeight = $targets
                            .reduce((p,$target)=>{
                                return Math.max(p, $target.clientHeight);
                            }, 0);
        $targets.forEach($target=>$target.style.minHeight = _minHeight.toFixed(2)+"px");
    }

    /** @param {HTMLElement} $tab */
    setActiveTab($tab) {
        this.$active.removeAttribute("tab-active");
        this.getTarget(this.$active).style.display = "none";
        this.$active = $tab;
        $tab.setAttribute("tab-active", "true");
        this.getTarget($tab).style.display = "block";
    }

    /** @param {HTMLElement} $tab */
    getTarget($tab) {
        let target = $tab.getAttribute("tab-target");
        let $target = this.$parent.querySelector(target);
        return $target;
    }
}

Array.from(
    document.getElementsByClassName("tabs")
).map($tab=>new Tab($tab));
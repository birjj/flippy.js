let $column = document.querySelector(".adding-elements .column");

setInterval(addModule, 2000);

function addModule() {
    let $module = document.createElement("div");
    $module.classList.add("module");

    flip(
        [$module, ...document.querySelectorAll(".adding-elements .module")],
        ()=>{
            // add our new module to the column
            $column.insertBefore(
                $module,
                $column.firstChild
            );
            // also remove the last module in the column
            $column.removeChild(
                $column.lastElementChild
            );
        },
        {
            duration: 600
        }
    )
}
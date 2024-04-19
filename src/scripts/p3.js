function p3zoom(_id) {
}

function p3zoomgx(_project, _glos, _gxis, _zoom) {
}

function hideNote(_e,nid) {
    var note = document.getElementById(nid);
    note.style.visibility = "hidden";
    note.style.zIndex = 0;
    return 1;
}

function showNote(e, nid) {
    var target = e.target.getBoundingClientRect();
    var x = target.right;
    var y = (target.top + target.bottom)/2;
    var note = document.getElementById(nid);

    if (note.style.visibility === "visible") {
        return;
    }

    var note_height = note.clientHeight;
    var note_half = note_height/2;

    var central_panel = document.getElementById("central-panel").getBoundingClientRect();
    var cp_top = central_panel.top;
    var cp_bottom = central_panel.bottom;

    var posy = Math.min(Math.max(cp_top, y - note_half), cp_bottom - note_height);

    note.style.top = posy + "px";
    note.style.left = x + "px";
    note.style.visibility = "visible";
    note.style.zIndex = 3;
}

$.fn.commentCardsFlip = function () {
    return this.each(function () {
        var $this = $(this),
            $cards = $this.find(".card-group-flip"),
            $current = $cards.filter(".card--current-flip"),
            $next;

        $cards.on("click", function () {
            if (!$current.is(this)) {
                $cards.removeClass("card--current-flip card--out-flip card--next-flip");
                $current.addClass("card--out-flip");
                $current = $(this).addClass("card--current-flip");
                $next = $current.next();
                $next = $next.length ? $next : $cards.first();
                $next.addClass("card--next-flip");
            }
        });

        if (!$current.length) {
            $current = $cards.last();
            $cards.first().trigger("click");
        }

        $this.addClass("cards--active");
    });
};

$(".cards-group-flip").commentCardsFlip();
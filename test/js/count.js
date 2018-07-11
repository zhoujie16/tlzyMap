(function($){
    $.fn.numberRock=function(options){
        var defaults={
        	run_count:0,
            speed:24,
            count:100
        };
        var opts=$.extend({}, defaults, options);

        var div_by = 100,
        count=opts["count"],
        speed = Math.floor(count / div_by),
        sum=0,
        $display = this,
        int_speed = opts["speed"];
        var int = setInterval(function () {
            if (opts.run_count <= div_by&&speed!=0) {
                $display.text((sum=speed * opts.run_count)+'%');
                opts.run_count++;
            } else if (sum < count) {
                $display.text(++sum + '%');
            } else {
                clearInterval(int);
            }
        }, int_speed);
    }

})(jQuery);


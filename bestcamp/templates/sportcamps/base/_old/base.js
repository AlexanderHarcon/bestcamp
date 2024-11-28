/**
 * base.js
 */
$(document).on('click', '.faq_question', function(){
    $(this).parents('.faq_item').toggleClass('opened');
});

$(document).on('click', '.current_lang', function(){
    $(this).parents('.lang_wrapp').toggleClass('opened');
});

$(document).on('click', '.hamburger', function(){
    $(this).parent().find('.header_hide_mobile').toggleClass('opened');
    $(this).toggleClass('active');
    $('body').toggleClass('overflow-hidden');
});

$(document).on('click', '.have_childs img', function(){
    if ($(window).width() <= 1024) {
        $(this).parent().toggleClass('opened');
    }
});

$(document).on('click', '.filter_category', function(){
    $(this).toggleClass('opened');
    $(this).next().slideToggle('slow');
})

$(document).on('click', '.filter_full_list_btn', function(){
    let filter_list = $(this).parent().find('.filter_values_list');

    if ($(this).hasClass('opened')) {
        hideFilterValueList(filter_list);
        $(this).parents('.filter_values_list_wrapp').mCustomScrollbar('destroy');
    } else {
        filter_list.children('.filter_value').show();
        $(this).parent().mCustomScrollbar({
            theme: "dark",
            axis:"y",
        });
    }

    $(this).toggleClass('opened');
})
$(document).on('click', '.js-call-popup', function(){
    if (!$(this).data('item')) {
        return;
    }
    let item = $('#' + $(this).data('item'));
    item.show();
    $('body').css('overflow', 'hidden');
})

$(document).on('click', '.js-close-popup', function(){
    $(this).parents('.popup_wrapper').hide();
    $('body').css('overflow', 'auto');
});

$(document).on('change', '.fake_filter', function(){
    $('form [value="'+$(this).val()+'"]').prop('checked', $(this).is(':checked'));
})

$(document).ready(function(){
    $(".have_scroll .offer_list").mCustomScrollbar({
        theme: "dark",
        axis:"x",
    });
    $('.have_scroll .country_list').each(function(){
        $(this).mCustomScrollbar({
            theme: "dark",
            axis:"x",
        });
    });

    $('.filter_values_list').each(function(){
        hideFilterValueList($(this));
    })
});

function hideFilterValueList(parent) {
    if (parent.children('.filter_value').length > 5) {
        parent.children('.filter_value').each(function(index) {
            if (index > 4) {
                $(this).hide();
            }
        })

        parent.parent().find('.filter_full_list_btn').css('display', 'flex');
    }
}
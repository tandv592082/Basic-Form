<?php
/*
 Soledad child theme functions and definitions
*/
function penci_soledad_child_scripts() {
    wp_enqueue_style( 'penci-soledad-parent-style', get_template_directory_uri(). '/style.css' );
	if ( is_rtl() ) {
		wp_enqueue_style( 'penci-soledad-rtl-style', get_template_directory_uri(). '/rtl.css' );
	}
}
add_action( 'wp_enqueue_scripts', 'penci_soledad_child_scripts', 100 );

//custom theme
function custom_theme() {
    wp_enqueue_script( 'form', get_template_directory_uri(). '/assets/js/form.js', array('jquery'), '', true);
    wp_enqueue_script( 'penci-soledad-parent-style', get_template_directory_uri(). '/assets/css/override.css' );
}
add_action( 'wp_enqueue_scripts', 'penci_soledad_child_scripts', 9999 );

/*
 * All custom functions go here
 */
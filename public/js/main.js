$(document).ready(() =>{
	$('.delete-article').on('click',(e) =>{
		$target = $(e.target);
		let id = $target.attr('data-id');
		$.ajax({
			type:'DELETE',
			url:'/articles/'+id,
			success: (res) =>{
				alert('Article Deleted');
				window.location.href="/";
			},
			error: (err) =>{
				console.log("ERROR");
			}
		})
	})
})
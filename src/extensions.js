/*eslint semi: ["error", "always"]*/
/* global Phaser */
/**
 * Make phaser's setCollisionBetween perform better
 * http://www.thebotanistgame.com/blog/2015/07/24/optimizing-giant-maps-lots-of-collisions.html
 */
Phaser.Tilemap.prototype.setCollisionBetween = function (start, stop, collides, layer, recalculate) {

	if (collides === undefined) { collides = true; }
	if (layer === undefined) { layer = this.currentLayer; }
	if (recalculate === undefined) { recalculate = true; }

	layer = this.getLayer(layer);

	for (var index = start; index <= stop; index++)
	{
		if (collides)
		{
			this.collideIndexes.push(index);
		}
		else
		{
			var i = this.collideIndexes.indexOf(index);

			if (i > -1)
			{
				this.collideIndexes.splice(i, 1);
			}
		}
	}

	for (var y = 0; y < this.layers[layer].height; y++)
	{
		for (var x = 0; x < this.layers[layer].width; x++)
		{
			var tile = this.layers[layer].data[y][x];

			if (tile && tile.index >= start && tile.index <= stop)
			{
				if (collides)
				{
					tile.setCollision(true, true, true, true);
				}
				else
				{
					tile.resetCollision();
				}

				tile.faceTop = collides;
				tile.faceBottom = collides;
				tile.faceLeft = collides;
				tile.faceRight = collides;
			}
		}
	}

	if (recalculate)
	{
		//  Now re-calculate interesting faces
		this.calculateFaces(layer);
	}

	return layer;

};

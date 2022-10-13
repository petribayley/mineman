const palettesArray =
{
	'pink': {
        alpha: '#2E0249',
      	beta: '#570A57',
      	charlie: '#A91079',
      	delta: '#F806CC'
	},
	'lightpurple': {
        alpha: '#937DC2',
        beta: '#C689C6',
        charlie: '#FFABE1',
        delta: '#FFE6F7'
	},
	'retrobeige': {
            alpha: '#594545',
            beta: '#815B5B',
            charlie: '#9E7676',
            delta: '#FFF8EA'
	}
}

export default function palettes ( paletteName ) {
    return palettesArray[paletteName]
}

export function getPalettes( ) {
    return palettesArray
}
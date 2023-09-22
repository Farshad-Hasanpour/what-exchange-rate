<template>
	<div>
		<template v-if="smAndDown">
			<transition-group id="card-view" tag="div" name="table-fade">
				<div class="item-card" v-for="item in items" :key="item.id">
					<div class="item-info" v-for="(header, property) in headers" :key="property">
						<span class="title">{{header.title}}: </span>
						<span class="value" :dir="header.dir">{{item[property]}}</span>
					</div>
					<div class="actions" v-if="actions">
						<label class="checkbox-option">
							<input
									:ref="`checkbox-${item.id}`"
									v-model="selected"
									type="checkbox"
									:value="item.id"
									class="checkbox-input"
							>
							<span class="checkbox"></span>
						</label>
						<Button
								v-for="(button, index) in actions"
								:key="index"
								type="icon"
								depressed
								height="32px"
								:color="button.color"
								:title="button.title"
								:loading="button.loadingProperty ? item[button.loadingProperty] : undefined"
								@click="$emit(button.event, item.id)"
						>
							<Icon :name="button.icon"/>
						</Button>
					</div>
				</div>
			</transition-group>
		</template>
		<table v-else>
			<thead>
				<tr>
					<th v-if="selectable">Select</th>
					<th v-for="(header, property) in headers" :key="property">{{header.title}}</th>
					<th v-if="actions">Actions</th>
				</tr>
				<tr v-if="hasSearchRow" class="search-row">
					<th v-if="selectable"></th>
					<th v-for="(header, property) in headers" :key="property" class="query-container">
						<input
							v-if="header.searchable"
							:value="query[property]"
							class="query-input"
							:placeholder="`Search ${header.title}`"
							@input="$set(query, property, $event.target.value)"
						>
					</th>
				</tr>
			</thead>
			<transition-group tag="tbody" name="table-fade">
				<tr v-if="loading" key="_loading-row" class="loading">
					<td :colspan="numberOfColumns">
						<Icon name="loading" size="36px" :color="themeColors.primary" rotate/>
					</td>
				</tr>
				<tr v-if="!queriedItems.length" key="_no-data-row" class="no-date">
					<td :colspan="numberOfColumns">No Data</td>
				</tr>
				<tr v-for="item in queriedItems" :key="item.id">
					<td v-if="selectable">
						<label class="checkbox-option">
							<input
								:ref="`checkbox-${item.id}`"
								v-model="selected"
								type="checkbox"
								:value="item.id"
								class="checkbox-input"
							>
							<span class="checkbox"></span>
						</label>
					</td>
					<td v-for="(header, property) in headers" :key="property" :dir="header.dir">{{item[property]}}</td>
					<td v-if="actions">
						<div class="actions">
							<Button
								v-for="(button, index) in actions"
								:key="index"
								type="icon"
								depressed
								height="32px"
								:color="button.color"
								:title="button.title"
								:loading="button.loadingProperty ? item[button.loadingProperty] : undefined"
								@click="$emit(button.event, item.id)"
							>
								<Icon :name="button.icon"/>
							</Button>
						</div>
					</td>
				</tr>
			</transition-group>
		</table>
	</div>
</template>

<script>
	export default {
		name: "Table",
		props:{
			loading:{required: true, type: Boolean},
			items:{required: true, type: Array},
			headers:{required: true, type: Object},
			selectable:{type: Boolean, default: () => false},
			maxSelectCount:{type: Number},
			value:{type: Array, default: () => []},
			actions:{type: Object, default: () => undefined}
		},
		watch: {
			headers: {
				immediate: true,
				deep: true,
				handler(newVal){
					const newFields = {};
					Object.entries(newVal).forEach(([name, value]) => {
						if(value.searchable) newFields[name] = ''
					})
					Object.assign(
						{},
						this.query,
						newFields
					)
				}
			},
		},
		computed:{
			selected:{
				get(){
					return this.value;
				},
				set(val){
					if(this.maxSelectCount && val.length > this.maxSelectCount){
						const lastId = val[val.length - 1];
						this.$refs['checkbox-'+lastId][0].checked = false;
						const message = `You can not select more than ${this.maxSelectCount} rows.`;
						this.$store.dispatch('showMessage', {messageType: 'error', message});
						return;
					}
					this.$emit('input', val);
				}
			},
			hasSearchRow(){
				return Object.entries(this.headers).map(item => item[1].searchable).includes(true);
			},
			themeColors(){ return this.$store.getters.themeColors},
			numberOfColumns(){
				let result = Object.keys(this.headers).length;
				if(this.selectable) result++;
				if(this.actions) result++;
				return result;
			},
			smAndDown(){
				return this.$store.getters.smAndDown;
			},
			queriedItems(){
				if(this.loading) return [];
				const query = Object.entries(this.query);
				let noFilter = true;
				for(let i = 0; i < query.length; i++){
					if(query[i][1]){
						noFilter = false;
						break;
					}
				}
				if(noFilter) return this.items;

				let property = null;
				let term = null;
				return this.items.filter(item => {
					for(let i = 0; i < query.length; i++){
						property = query[i][0];
						term = query[i][1];
						if(term && item[property].includes(term)) return true;
					}
					return false;
				})
			}
		},
		data(){
			return {
				query: {}
			}
		}
	}
</script>

<style scoped>
	table{
		border-collapse: collapse;
		width: 100%;
	}

	td, th{
		text-align: center;
		padding: 10px 10px;
	}
	tr:not(.loading):not(.no-data){
		border-bottom: 1px solid var(--color-line);
	}
	.actions{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.item-card .actions{
		justify-content: flex-end;
	}
	.actions > *:not(:last-child){
		margin-inline-end: 7px;
	}

	input[type="checkbox"]{
		cursor: pointer;
	}

	tr.loading td,
	tr.no-date td{
		padding: 16px 0;
	}

	#card-view{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
	}

	.item-card{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		width: 100%;
		border-bottom: 1px solid var(--color-line);
		padding: 16px 16px;
	}

	.item-info{margin-bottom: 5px;}
	.item-info .title{ font-weight: bold; }

	.query-input{
		color: var(--color-text);
		height: 42px;
		margin: 4px;
		width: 100%;
		border-radius: 4px;
		outline: none;
		background-color: var(--color-card-back);
		border: none;
		font-family: Nunito, sans-serif;
		padding-left: 12px;
		padding-right: 12px;
	}

	/* animation */
	.table-fade-enter-active, .table-fade-leave-active {
		transition: opacity .3s;
	}
	.table-fade-enter, .table-fade-leave-to {
		opacity: 0;
	}
	.table-fade-move{
		transition: transform .3s;
	}
</style>
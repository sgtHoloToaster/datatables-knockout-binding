ko.bindingHandlers.datatable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const data = valueAccessor();
        bindingContext.update = () => {
            $(element).closest('table').DataTable().destroy();
            ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
            var tableOptions = allBindings.get("tableOptions") || {};
            tableOptions.deferRender = true;
            $(element).closest('table').DataTable(tableOptions);
        };

        data.subscribe(bindingContext.update, null, 'arrayChange');
        const nodes = Array.prototype.slice.call(element.childNodes, 0);
        ko.utils.arrayForEach(nodes, function (node) {
            if (node && node.nodeType !== 1) {
                node.parentNode.removeChild(node);
            }
        });

        return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindings, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const key = 'dt-initialized';
        var data = ko.utils.unwrapObservable(valueAccessor());
        if (!ko.utils.domData.get(element, key) && data) {
            bindingContext.update();
            ko.utils.domData.set(element, key, true);
        }
    }
};